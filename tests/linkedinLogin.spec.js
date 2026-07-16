// Automated LinkedIn ZIP Solver
// This Playwright test authenticates with LinkedIn, reconstructs the
// daily ZIP puzzle from the DOM, computes a valid solution using DFS,
// and automatically plays the solution.
const {test,expect} = require('@playwright/test');
const doenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Direction vectors representing Up, Left, Right and Down.
const dx = [-1, 0, 0, 1];
const dy = [0, -1, 1, 0];
let isEnd = false;

// Configure environment variables from the local .env file.
doenv.config({
    path : path.join(__dirname,'../','/.env')
});

// Performs a Depth-First Search (DFS) with backtracking to find a
// valid path through the puzzle while respecting numbered cells,
// walls and ensuring every cell is visited exactly once.
function DFS(mat, mpp, ans, ci, cj, lastInd, currNum, vis) {
    vis[ci][cj] = true;
    if (ans.length === mat.length * mat[0].length && ans[ans.length - 1] === lastInd) {
        isEnd = true;
        vis[ci][cj] = false;
        return;
    } else if (ans[ans.length - 1] === lastInd) {
        vis[ci][cj] = false;
        return;
    }

    for (let i = 0; i < 4 && !isEnd; i++) {
        const ni = ci + dx[i];
        const nj = cj + dy[i];
        if (ni >= 0 && nj >= 0 && ni < mat.length && nj < mat[0].length && (mat[ni][nj] === 0 || mat[ni][nj] === currNum + 1) && !vis[ni][nj] ) {
            const nextNum = mat[ni][nj] === 0 ? currNum : mat[ni][nj];
            const key = ci * mat.length + (cj);
            if (mpp.has(key)) {
                const cell = mpp.get(key);
                if (cell[i] !== -1) {
                    ans.push(ni * mat.length + (nj));
                    DFS(mat,mpp,ans,ni,nj,lastInd,nextNum,vis);
                    if (!isEnd) ans.pop();
                }
            } else {
                ans.push(ni * mat.length + (nj));
                DFS(mat,mpp,ans,ni,nj,lastInd,nextNum,vis);
                if (!isEnd) ans.pop();
            }
        }
    }
    vis[ci][cj] = false;
}

// Extract the number of rows and columns from the grid's
// inline style attribute.
function getRowAndCol (styleAttribute){
    let Row = 0;
    let Col = 0;
    let colon = 0;
    for(let i=0;i<styleAttribute.length;i++){
        if(styleAttribute.charAt(i)==':'){
            colon++;
            i+=2;
            if(colon==1)Row = styleAttribute.charAt(i)-'0';
            else Col = styleAttribute.charAt(i)-'0';
        }
    }
    return {
        Rows : Row,Cols : Col
    }
}

// Creates a new authenticated LinkedIn session and stores it
// locally as 'linkedin.json' for reuse in future executions.
async function createAuth(page,context){
    await page.goto('https://www.linkedin.com/login/');
    await page.getByRole('textbox', { name: 'Email or phone' }).fill(process.env.email);
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.pass);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    const URL = page.url();
    if(URL.includes("/login")){
        console.log("Wrong username or Password");
    }
    // LinkedIn may require additional verification (2FA, CAPTCHA,
    // email/phone verification or a security checkpoint) during the
    // first login. Pause execution until the user completes the
    // verification manually, then save the authenticated session.
    else if(URL.includes('/checkpoint/challenge')){
        await page.pause();
        console.log("auth saved");
    }
    else if(URL.includes('/feed')){
            console.log("auth saved");
    }
    await context.storageState({
        path : 'linkedin.json'
    });
    await page.close();
    return 1;
}

// Main Playwright test:
// 1. Authenticate the user.
// 2. Read the ZIP puzzle.
// 3. Compute the solution.
// 4. Replay the solution automatically.
test("Linkedin Login",async function({browser}){
    let authContext;
    let authPage;
    // Create a new authenticated session only if one
    // does not already exist.
    if(!fs.existsSync('linkedin.json')){
        const context = await browser.newContext();
        const page = await context.newPage();
        console.log('creating auth at line 97');
        const res = await createAuth(page,context);
        if(res == 0)console.log('error at line 99');
        authContext = await browser.newContext({
            storageState:'linkedin.json'
        });
        authPage = await authContext.newPage();
        await authPage.goto('https://www.linkedin.com/login/');
        await authPage.getByRole('textbox', { name: 'Email or phone' }).fill(process.env.email);
        await authPage.getByRole('textbox', { name: 'Password' }).fill(process.env.pass);
        await authPage.getByRole('button', { name: 'Sign in', exact: true }).click();
        await authPage.waitForTimeout(3000);
    }
    // Reuse the previously saved authenticated session.
    else{
        authContext = await browser.newContext({
            storageState:'linkedin.json'
        });
        authPage = await authContext.newPage();
        await authPage.goto('https://www.linkedin.com/feed');
        //await authPage.getByRole('textbox', { name: 'Email or phone' }).fill(process.env.email);
        //await authPage.getByRole('textbox', { name: 'Password' }).fill(process.env.pass);
        //await authPage.getByRole('button', { name: 'Sign in', exact: true }).click();
        await authPage.waitForURL(/feed|checkpoint\/challenge/);
    }

    // If LinkedIn requests another security verification,
    // pause the execution and save the refreshed session
    // after verification is completed.
    if(authPage.url().includes("checkpoint/challenge")){
        await authPage.pause();
        console.log("auth saved");
        await authContext.storageState({
            path : 'linkedin.json'
        })
        await authPage.goto('https://www.linkedin.com/feed');
    }
    if(authPage.url().includes("feed")){
        await expect(authPage).toHaveURL(/feed/);
        await authPage.waitForTimeout(3000);
        // Navigate to the daily LinkedIn ZIP puzzle.
        await authPage.goto('https://www.linkedin.com/games/zip');
        const data = authPage.locator('div[data-testid="interactive-grid"]');
        const styleAttributeFromData = await data.getAttribute('style');
        const Dimensions = getRowAndCol(styleAttributeFromData);
        const grid = Array.from({ length: Dimensions.Rows }, () => Array(Dimensions.Cols).fill(0));
        const mpp = new Map();
        for(let i=0;i<Dimensions.Rows;i++){
            for(let j=0;j<Dimensions.Cols;j++){
                let cellNo = i*Dimensions.Rows + (j);
                const cell = data.locator(`div[data-cell-idx="${cellNo}"]`);
                const isNumbered = cell.locator('div[data-cell-content="true"]');
                if(await isNumbered.count() >0 ){
                    let number = await isNumbered.getAttribute('aria-label');
                    grid[i][j]=number-'0';
                }
                // Inspect the CSS ::after pseudo-element to determine
                // whether walls exist on each side of the current cell.
                const walls = await cell.locator('div').evaluateAll(divs => {
                    let arr = [0,0,0,0];
                    for (const div of divs) {
                        const afterStyle = window.getComputedStyle(div, '::after');
                        if(afterStyle == 'none' || afterStyle == 'normal')continue;
                        if (parseInt(afterStyle.borderTopWidth) === 12) arr[0] = -1;
                        if (parseInt(afterStyle.borderLeftWidth) === 12) arr[1] = -1;
                        if (parseInt(afterStyle.borderRightWidth) === 12) arr[2] = -1;
                        if (parseInt(afterStyle.borderBottomWidth) === 12) arr[3] = -1;
                    }
                    return arr;
                }); 
                let blocks = [0,0,0,0];
                if(mpp.has(cellNo))blocks = mpp.get(cellNo);
                if(walls[0]===-1){
                    blocks[0] = -1;
                    let blockBottom = [0,0,0,0];
                    if(mpp.has(cellNo-Dimensions.Cols))blockBottom=mpp.get(cellNo-Dimensions.Cols);
                    blockBottom[3] = -1;
                    mpp.set(cellNo-Dimensions.Cols,blockBottom);
                }
                if(walls[1]===-1){
                    blocks[1] = -1;
                    let blockLeft = [0,0,0,0];
                    if(mpp.has(cellNo-1))blockLeft=mpp.get(cellNo-1);
                    blockLeft[2]=-1;
                    mpp.set(cellNo-1,blockLeft);
                }
                if(walls[2]===-1){
                    blocks[2] = -1;
                    let blockRight = [0,0,0,0];
                    if(mpp.has(cellNo+1))blockRight=mpp.get(cellNo+1);
                    blockRight[1]=-1;
                    mpp.set(cellNo+1,blockRight);
                }
                if(walls[3]===-1){
                    blocks[3] = -1;
                    let blockTop = [0,0,0,0];
                    if(mpp.has(cellNo+Dimensions.Cols))blockTop=mpp.get(cellNo+Dimensions.Cols);
                    blockTop[0]=-1;
                    mpp.set(cellNo+Dimensions.Cols,blockTop);
                }
                mpp.set(cellNo,blocks);
            }
        }
        // Find the highest numbered cell, which represents
        // the final numbered destination in the puzzle.
        let maxNum = 0;
        let maxi = -1;
        let maxj = -1;
        const ans = [];
        const vis = Array.from({ length: Dimensions.Rows }, () => Array(Dimensions.Cols).fill(false));
        // Start DFS from every cell containing the number 1
        // until a valid solution is found.
        for(let i=0;i<Dimensions.Rows;i++){
            for(let j=0;j<Dimensions.Cols;j++){
                if (grid[i][j] > maxNum) {
                    maxNum = grid[i][j];
                    maxi = i;
                    maxj = j;
                }
            }
        }

        for(let i=0;i<Dimensions.Rows;i++){
            for(let j=0;j<Dimensions.Cols;j++) {
                if (grid[i][j] === 1) {
                    ans.push(i * grid.length + (j));
                    DFS(grid,mpp,ans,i,j,maxi * grid.length + (maxj),1,vis);
                }
            }
        }
        // Replay the computed path by simulating keyboard
        // arrow key presses in the browser.
        let prev = ans[0];
        for(let i=0;i<ans.length;i++){
            if(i==0){
                await data.locator(`div[data-cell-idx="${ans[0]}"]`).click();
            }
            else{
                if(ans[i]==prev+1)await authPage.keyboard.press('ArrowRight');
                else if(ans[i]==prev-1)await authPage.keyboard.press('ArrowLeft');
                else if(ans[i]<prev)await authPage.keyboard.press('ArrowUp');
                else await authPage.keyboard.press('ArrowDown');
            }
            prev = ans[i];
        }
        await authPage.waitForTimeout(5000);
    }
})

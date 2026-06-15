const fs = require('fs');

const svgCode = fs.readFileSync('src/components/Common/SannvaraLogo.tsx', 'utf8');

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><div>${svgCode.replace('SannvaraLogo({ className }: { className?: string })', 'S()').replace('export default function', 'function')}</div>`);

// Since jsdom doesn't support getBBox, we will use a small logic.
// Actually there are no path parsing libraries installed.
// We can use 'svg-path-bounding-box' via npx


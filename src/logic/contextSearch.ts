import { searchIndex } from "./search";

// TODO - very hackish and buggy
export function findClickedNuggets(e) {
    e.preventDefault();
    const s = window.getSelection();
    const range = s.getRangeAt(0);
    const node = s.anchorNode;
    range.setStart(node, range.startOffset);  
    range.setEnd(node, range.endOffset);        
    while (range.toString().indexOf(' ') != 0) {
        range.setStart(node, (range.startOffset - 1));
    }
    range.setStart(node, range.startOffset + 1);
    do {
        range.setEnd(node, range.endOffset + 1);
    } while (range.toString().indexOf(' ') == -1 && range.toString().trim() != '' && range.endOffset < node.length);
    const str = range.toString().trim();
    const nuggets = searchIndex(str, []);
    return nuggets;
}
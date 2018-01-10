import { IKeyMap } from "models";

export default {
    moveUp: ["up"],
    moveDown: ["down"],
    moveBack: ["left"],
    openDirectory: ["enter"],
    switchPane: ["tab"],
    activate: ["enter"],
    openInNativeExplorer: ["ctrl+o"],
    toggleShowHidden: ["ctrl+h"],
    newFile: ["ctrl+n"],
    newFolder: ["ctrl+shift+n"],
    rename: ["ctrl+shift+r"],
    sendToTrash: ["del"],
    delete: ["ctrl+del"],
    cut: ["ctrl+x"],
    copy: ["ctrl+c"],
    paste: ["ctrl+v"],
    openCommandPalette: ["f1"],
    chooseItem: ["space"],
    openGoto: ["ctrl+e"],
    scrollToTop: ["pageup"],
    scrollToBottom: ["pagedown"]
} as IKeyMap;

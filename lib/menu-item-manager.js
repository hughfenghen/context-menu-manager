'use babel';
import _ from 'underscore'

const CFG_KEY = 'context-menu-manager'

const menuSets = atom.contextMenu.itemSets
const keyBindings = atom.contextMenu.keymapManager.keyBindings
const config = atom.config.get(CFG_KEY) || {}

const hiddenCfg = new Set(config.hidden || [])

const hiddenBackup = {}

export const extraStrokesCfg = new Set(config.extraStrokes || [])

export function init() {
    extMeuns()
    hiddenCfg.forEach((menuKey) => {
        removeMenuItem(...menuKey.split('|||'))
    })
}

export function extMeuns() {
    menuSets.forEach((contextMenuItemSet) => {
        // 给所有菜单项添加selector、id，如果已存在则忽略
        contextMenuItemSet.items.forEach(function(it, idx) {
            it._ext_selector = contextMenuItemSet.selector
            it._ext_idx = idx

            if (extraStrokesCfg.has(it.command)) {
                it.label += `  (${findMenuStrokes(it.command)})`
            }
        })
    })
}

export function removeMenuItem(selector, command) {
    const contextMenuItemSet = _.findWhere(menuSets, {
        selector
    })

    if (!contextMenuItemSet) return

    const idx = _.findIndex(contextMenuItemSet.items, (it) => {
        return it.command === command
    })

    if (idx !== -1) {
        const mi = contextMenuItemSet.items.splice(idx, 1)[0]
        const k = `${selector}|||${command}`

        hiddenBackup[k] = mi
        hiddenCfg.add(k)
        updateConfig()

        return mi
    } else {
        console.error('未找到需要隐藏的菜单项')
    }
}

export function resetMenuItem(selector, command) {
    const contextMenuItemSet = _.findWhere(menuSets, {
        selector
    })

    if (!contextMenuItemSet) return

    const k = `${selector}|||${command}`
    const mi = hiddenBackup[k]
    if (mi) {
        contextMenuItemSet.items.push(mi)
        contextMenuItemSet.items.sort((a, b) => {
            return a._ext_idx - b._ext_idx
        })

        delete hiddenBackup[k]
        hiddenCfg.delete(k)
        updateConfig()
    } else {
        console.error('未找到需要显示的菜单项')
    }
}

export function getHiddenMenus() {
    return _.values(hiddenBackup)
}

export function getVisibleMenus() {
    return _.chain(menuSets)
        .pluck('items')         // 萃取selector中的菜单项
        .flatten()              // 降维成一维数组
        .tap((s) => {
            // 添加子菜单
            s.splice(
                0,
                0,
                ..._.chain(s)
                    .pluck('submenu')
                    .filter((it) => it)
                    .flatten()
                    .value()
            )
        })
        .filter((it) => it.command)      // 过滤菜单分割线
        .value()
}

// 给菜单label附加快捷键
export function toggleMenuLabel(selector, command, isAdd) {
    const mi = _.findWhere(getVisibleMenus()
        .concat(getHiddenMenus()), {
            _ext_selector: selector,
            command
        })

    if (isAdd) {
        const keystrokes = findMenuStrokes(command)

        if (keystrokes) {
            extraStrokesCfg.add(command)
            updateConfig()

            mi.label += `  (${keystrokes})`
        }
    } else {
        if (extraStrokesCfg.has(command)) {
            extraStrokesCfg.delete(command)
            updateConfig()
        }

        mi.label = mi.label.replace(/\s*\(.+?\)+/g, '')
    }

    return mi.label
}

function findMenuStrokes(command) {
    const {
        keystrokes = ''
    } = _.findWhere(keyBindings, {
        command
    }) || {}

    return keystrokes
}

function updateConfig() {
    atom.config.set(CFG_KEY, {
        hidden: [...hiddenCfg],
        extraStrokes: [...extraStrokesCfg]
    })
}

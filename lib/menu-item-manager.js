'use babel';
import _ from 'underscore'

const HIDDEN_CFG_KEY = 'right-menu-manager-hidden'

const menuSets = atom.contextMenu.itemSets
const hiddenCfg = new Set(atom.config.get(HIDDEN_CFG_KEY) || [])

const hiddenBackup = {}

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
        atom.config.set(HIDDEN_CFG_KEY, [...hiddenCfg])

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
        atom.config.set(HIDDEN_CFG_KEY, [...hiddenCfg])
    } else {
        console.error('未找到需要显示的菜单项')
    }
}

export function getHiddenMenus() {
    return _.values(hiddenBackup)
}

export function getVisibleMenus() {
    return _.chain(menuSets)
        .pluck('items') // 萃取selector中的菜单项
        .flatten() // 降维成一维数组
        .filter((it) => {
            return it.command
        })
        .value()
}

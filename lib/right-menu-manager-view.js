'use babel';

import _ from 'underscore'
import {
    $,
    ScrollView
} from 'atom-space-pen-views'

const menuSets = atom.contextMenu.itemSets
const hiddenMenus = {}

const hiddenMenuCfg = new Set()

const eventHandler = {
    hideMenuItem(e) {
        const [extSelector, label, command, extId] = $(e.target).parent().siblings('.data').val().split('|||')

        const hiddenMenu = removeMenuItem(extSelector, extId)

        if (hiddenMenu) {
            hiddenMenus[`${extSelector}|||${extId}`] = hiddenMenu
        }
    },
    showMenuItem(e) {
        const [extSelector, label, command, extId] = $(e.target).parent().siblings('.data').val().split('|||')

        const mi = hiddenMenus[`${extSelector}|||${extId}`]

        if (!mi) {
            console.error('未找到需要显示的菜单项')
            return
        }
        const items = _.findWhere(menuSets, {
            selector: extSelector
        }).items

        items.push(mi)
        items.sort((a, b) => {
            return a._ext_id - b._ext_id
        })
    }
}

function removeMenuItem(extSelector, extId) {
    const contextMenuItemSet = _.findWhere(menuSets, {
        selector: extSelector
    })

    if (!contextMenuItemSet) return

    const idx = _.findIndex(contextMenuItemSet.items, (it) => {
        return it._ext_id === extId
    })

    if (idx !== -1) {
        return contextMenuItemSet.items.splice(idx, 1)[0]
    }
}

export default class RightMenuManagerView extends ScrollView {
    static content() {
        this.raw(`
            <div class="right-menu-manager">
                <div class="search-bar">
                    <span>Search:</span>
                    <input type="text" name="" value="">
                </div>
                <div class="search-result">

                </div>
                <div class="test">

                </div>
            </div>
        `)
    }

    initialize(item, option) {
        super.initialize()

        this.extMeuns()
        this.createResDom(this.getAllMenus())

        this.bind()
    }

    createResDom(menus) {
        var htmlStr = menus.map(function(it) {
            return `<div class="menu-item" >
                <input class="data" type="hidden" value="${it._ext_selector}|||${it.label}|||${it.command}|||${it._ext_id}">
                <div class="left">
                    <span>${it.label || it.type}</span>
                    <span>(selector: ${it._ext_selector})</span>
                </div>
                <div class="center">
                    ${it.command || ''}
                </div>
                <div class="right">
                    <button class="hideBtn" type="button" name="button">隐藏</button>
                    <button class="showBtn" type="button" name="button">显示</button>
                </div>
            </div>`
        }).join('')

        this.find('.search-result').html(htmlStr)
    }

    extMeuns() {
        menuSets.forEach((contextMenuItemSet) => {
            // 给所有菜单项添加selector、id，如果已存在则忽略
            contextMenuItemSet.items.forEach(function(it) {
                it._ext_selector = it._ext_selector || contextMenuItemSet.selector
                it._ext_id = it._ext_id || _.uniqueId()
            })
        })
    }

    getAllMenus() {
        return _.chain(menuSets)
        .pluck('items')         // 萃取selector中的菜单项
        .flatten()              // 打平成一个数组
        .value()
    }

    bind() {
        this.on('click', '.hideBtn', eventHandler.hideMenuItem)
        this.on('click', '.showBtn', eventHandler.showMenuItem)
    }

    getTitle() {
        return 'Right-Menu-Manager'
    }
}

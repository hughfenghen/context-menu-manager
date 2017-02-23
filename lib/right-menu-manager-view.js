'use babel';

import fs from 'fs'
import _ from 'underscore'
import {
    $,
    ScrollView
} from 'atom-space-pen-views'

const menuSets = atom.contextMenu.itemSets
const hiddenMenuSets = {}

const eventHandler = {
    hideMenuItem(e) {
        const [selector, label, command] = $(e.target).parent().siblings('.data').val().split('|||')
        console.log(selector, label, command)
        const [selectorIdx, menuItemIdx] = findMenuItemIndex(selector, label, command)

        if (selectorIdx !== -1 && menuItemIdx !== -1) {
            // 移除菜单项
            menuSets[selectorIdx].items.splice(menuItemIdx, 1)
        }
    }
}

function findMenuItemIndex(selector, label, command) {
    const a = _.findIndex(menuSets, (contextMenuItemSet) => {
        return contextMenuItemSet.selector === selector
    })

    if (a === -1) return [-1, -1]

    const b = _.findIndex(menuSets[a].items, (it) => {
        return it.label === label && it.command === command
    })

    return [a, b]
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
                <input class="data" type="hidden" value="${it.selector}|||${it.label}|||${it.command}">
                <div class="left">
                    <span>${it.label}</span>
                    <span>(selector: ${it.selector})</span>
                </div>
                <div class="center">
                    ${it.command}
                </div>
                <div class="right">
                    <button class="hideBtn" type="button" name="button">隐藏</button>
                </div>
            </div>`
        }).join('')

        this.find('.search-result').html(htmlStr)
    }

    extMeuns() {
        menuSets.forEach((contextMenuItemSet) => {
            // 给所有菜单项添加selector、初始化时位置
            contextMenuItemSet.items.forEach(function(it, idx) {
                it._ext_selector = contextMenuItemSet.selector
                it._ext_index = idx
            })
        })
    }

    getAllMenus() {
        return _.chain(menuSets)
        .pluck('items')         // 萃取selector中的菜单项
        .flatten()              // 打平成一个数组
        // .filter((it) => {       // 过滤菜单中间分割线
        //     return it.label
        // })
        .value()
    }

    bind() {
        this.on('click', '.hideBtn', eventHandler.hideMenuItem)
    }

    getTitle() {
        return 'Right-Menu-Manager'
    }
}

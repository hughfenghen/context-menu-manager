'use babel';

import _ from 'underscore'
import {
    $,
    ScrollView
} from 'atom-space-pen-views'
import {
    extMeuns,
    removeMenuItem,
    resetMenuItem,
    getHiddenMenus
} from './menu-item-manager';

const menuSets = atom.contextMenu.itemSets

const eventHandler = {
    hideMenuItem(e) {
        const [selector, label, command] = $(e.target).parent().siblings('.data').val().split('|||')

        removeMenuItem(selector, command)
    },
    showMenuItem(e) {
        const [selector, label, command] = $(e.target).parent().siblings('.data').val().split('|||')

        resetMenuItem(selector, command)
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
        // extMeuns()
        this.createResDom(this.getAllMenus())

        this.bind()
    }

    createResDom(menus) {
        var htmlStr = menus.map(function(it) {
            return `<div class="menu-item" >
                <input class="data" type="hidden" value="${it._ext_selector}|||${it.label}|||${it.command}">
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

    getAllMenus() {
        return _.chain(menuSets)
            .pluck('items') // 萃取selector中的菜单项
            .flatten() // 打平成一个数组
            .filter((it) => {
                return it.command
            })
            .tap((source) => {
                source.unshift(...getHiddenMenus())
            })
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

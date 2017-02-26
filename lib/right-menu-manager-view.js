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
    getHiddenMenus,
    getVisibleMenus
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
                    <div>
                </div>
                <div class="hidden-menus"></div>
                <div class="visible-menus"></div>
            </div>
        `)
    }

    initialize(item, option) {
        super.initialize()
        // extMeuns()
        this.find('.hidden-menus').html(this.createMenuDom(getHiddenMenus()))
        this.find('.visible-menus').html(this.createMenuDom(getVisibleMenus()))

        this.bind()
    }

    createMenuDom(menus) {
        return menus.map(function(it) {
            return `<div class="menu-item" >
                <input class="data" type="hidden" value="${it._ext_selector}|||${it.label}|||${it.command}">
                <div class="left">
                    <div>${it.label || it.type}</div>
                    <div>
                        <span>{selector: "${it._ext_selector}"</span>
                        <span>command: "${it.command || ''}"}</span>
                    </div>
                </div>
                <div class="center">
                </div>
                <div class="right">
                    <button class="hideBtn" type="button" name="button">隐藏</button>
                    <button class="showBtn" type="button" name="button">显示</button>
                </div>
            </div>`
        }).join('')
    }

    bind() {
        this.on('click', '.hideBtn', eventHandler.hideMenuItem)
        this.on('click', '.showBtn', eventHandler.showMenuItem)
    }

    getTitle() {
        return 'Right-Menu-Manager'
    }
}

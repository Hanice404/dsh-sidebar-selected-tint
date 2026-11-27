/**
 * dsh-sidebar-selected-tint — Host 入口。
 *
 * 本插件只有浏览器端行为（一条样式表），Host 端不需要任何逻辑。这个模块的
 * 作用是让 Bundle 拥有一个可被 Loader 解析的条目，从而出现在「插件」列表中。
 *
 * @module dsh-sidebar-selected-tint
 */

export const name = 'sidebar-selected-tint';

/** Host 端无需操作；所有实现都在 client.js。 */
export function apply() {}

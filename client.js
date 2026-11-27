/**
 * dsh-sidebar-selected-tint — Client 端。
 *
 * 目标：左侧边栏里被选中的会话行，高亮色从官方默认的灰色（
 * `--dsw-alias-interactive-bg-hover`）改为浅红色。
 *
 * 为什么用样式表而不是 Slot：
 *   官方侧边栏的会话行是 `@deepseek-ai/dsh-client-ui-workspace` 渲染的，
 *   它只对外暴露行内插槽（`sidebar.session.row.leading` / `.trailing` /
 *   `.hover`），没有提供“整行背景”的插槽，所以只能追加一条样式表覆盖该行
 *   的选中态背景。
 *
 * 选择器为什么用 `class*=` 而不是固定类名：
 *   官方用 CSS Modules，类名带构建哈希前缀，例如
 *   `.YDXeBa_sessionRow.YDXeBa_selected{background-color:var(--dsw-alias-interactive-bg-hover)}`。
 *   哈希前缀会随版本变化，而 `_sessionRow` / `_selected` 这类语义后缀来自源码
 *   里的模块类名，跨版本稳定。`_searchResultRow` 是侧边栏搜索结果里的会话行，
 *   同属“选中会话标题”，一并处理。
 *
 * 优先级：`:root` 让本规则多出一个伪类的权重（0,3,0），高于官方的
 * `.sessionRow.selected`（0,2,0），因此不需要 `!important`。
 */

window.__ModuleLoader__.load({
  id: 'dsh-sidebar-selected-tint',
  factory() {
    /** 样式表元素 id：重复 apply（HMR、热重载）时先移除旧节点，避免堆叠。 */
    const STYLE_ID = 'dsh-sidebar-selected-tint-style';

    /**
     * 选中行背景：
     *   1. 第一条是 rgba 兜底，任何浏览器都认；
     *   2. 第二条用 color-mix 取主题里的错误红（两套主题下都是红色）与透明混合，
     *      于是浅色主题得到浅红、深色主题得到暗红，不必自己判断主题。
     * 深色主题下透明度略高，避免红色被深底吃掉。
     */
    const STYLESHEET = `
/* dsh-sidebar-selected-tint: 侧边栏选中会话行改为浅红高亮 */
:root [class*="_sessionRow"][class*="_selected"],
:root [class*="_searchResultRow"][class*="_selected"] {
  background-color: rgba(226, 74, 96, 0.18);
  background-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #e04257) 20%, transparent);
}

@media (prefers-color-scheme: dark) {
  :root [class*="_sessionRow"][class*="_selected"],
  :root [class*="_searchResultRow"][class*="_selected"] {
    background-color: rgba(226, 74, 96, 0.26);
    background-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #e04257) 28%, transparent);
  }
}
`;

    function apply(ctx) {
      // 只在 apply 里产生副作用，卸载时由 effect 的清理函数移除样式表。
      ctx.effect(() => {
        if (typeof document === 'undefined' || !document.head) return () => {};

        const stale = document.getElementById(STYLE_ID);
        if (stale !== null) stale.remove();

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.dataset.dshPlugin = 'dsh-sidebar-selected-tint';
        style.textContent = STYLESHEET;
        document.head.append(style);

        return () => {
          style.remove();
        };
      }, 'sidebar-selected-tint: selected session row stylesheet');
    }

    return { name: 'sidebar-selected-tint', apply };
  },
});

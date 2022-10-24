<template>
  <v-md-container
    :left-toolbar="leftToolbar"
    :right-toolbar="rightToolbar"
    :toolbars="toolbars"
    :disabled-menus="disabledMenus"
    :height="height"
    :fullscreen="fullscreen"
    :left-area-visible="tocVisible"
    :left-area-title="langConfig.toc.title"
    :left-area-reverse="tocNavPositionRight"
    :mode="currentMode"
    @editor-wrapper-click="handleEditorWrapperClick"
    @toolbar-item-click="handleToolbarItemClick"
    @toolbar-menu-click="handleToolbarMenuClick"
    ref="contaner"
  >
    <template #left-area>
      <scrollbar>
        <toc-nav
          :titles="titles"
          @nav-click="handleNavClick"
        />
      </scrollbar>
    </template>
    <template #editor>
      <scrollbar
        @scroll="handleEditorScroll"
        ref="editorScroller"
      >
        <v-md-textarea-editor
          :model-value="text"
          :min-height="textEditorMinHeight"
          :placeholder="placeholder"
          @update:modelValue="handleInput"
          @click.stop
          @drop="handleDrop"
          @paste="handlePaste"
          @blur="handleBlur"
          ref="editorEngine"
        />
      </scrollbar>
    </template>
    <template #preview>
      <scrollbar ref="previewScroller">
        <v-md-preview
          :text="text"
          :tab-size="tabSize"
          :scroll-container="getPreviewScrollContainer"
          :before-change="beforePreviewChange"
          @change="handleChange"
          @image-click="handlePreviewImageClick"
          ref="preview"
        />
      </scrollbar>
    </template>
  </v-md-container>
</template>

<script>
import TextareaEditor from './components/textarea-editor.vue';
import createEditor from './create-editor';
import './assets/css/font.css';
import { inBrowser } from './utils/util';

const component = {
  components: {
    [TextareaEditor.name]: TextareaEditor,
  },
  watch: {
    modelValue() {
      this.text = this.modelValue;
    },
    height: {
      async handler() {
        if (!inBrowser) return;

        await this.$nextTick();

        if (this.height) {
          const editorWrapper = this.$el.querySelector('.v-md-editor__editor-wrapper');
          this.textEditorMinHeight = window.getComputedStyle(editorWrapper).height;
        } else {
          this.textEditorMinHeight = '';
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      textEditorMinHeight: '',
    };
  },
  emits: ['paste', 'drop'],
  methods: {
    handlePaste(e) {
      this.$emit('paste', e);
    },
    handleDrop(e) {
      this.$emit('drop', e);
    },
    handleEditorWrapperClick() {
      this.setFocusEnd();
    },
    // Must implement
    editorFocusEnd() {
      this.focus();

      this.$refs.editorEngine.setRange({
        start: this.text.length,
        end: this.text.length,
      });
    },
    // Must implement
    delLineLeft() {
      const { editorEngine } = this.$refs;
      const { start } = editorEngine.getRange();

      const leftText = this.getCursorLineLeftText();
      editorEngine.setRange({ start: start - leftText.length - 1, end: start });
      this.replaceSelectionText('\n');
    },
    // Must implement
    getCursorLineLeftText() {
      const { start, end } = this.$refs.editorEngine.getRange();

      return start === end ? this.text.slice(0, start).split('\n').pop() : null;
    },
    // Must implement
    editorRegisterHotkeys(...arg) {
      this.$refs.editorEngine.registerHotkeys(...arg);
    },
    // Must implement
    editorScrollToTop(scrollTop) {
      this.$refs.editorScroller.scrollTo(scrollTop);
    },
    // Must implement
    getScrollInfo() {
      return this.$refs.editorScroller.getScrollInfo();
    },
    // Must implement
    heightAtLine(...arg) {
      return this.$refs.editorEngine.heightAtLine(...arg);
    },
    // Must implement
    focus() {
      this.$refs.editorEngine.focus();
    },
    // Must implement
    undo() {
      this.$refs.editorEngine.undo();
    },
    // Must implement
    redo() {
      this.$refs.editorEngine.redo();
    },
    // Must implement
    clear() {
      this.focus();

      this.handleInput('');
    },
    // Must implement
    replaceSelectionText(text) {
      this.$refs.editorEngine.insertText(text);
    },
    // Must implement
    getCurrentSelectedStr() {
      const { start, end } = this.$refs.editorEngine.getRange();

      return end > start ? this.text.slice(start, end) : null;
    },
    // Must implement
    changeSelctionTo(insertText, selectedText) {
      const { editorEngine } = this.$refs;
      const selectedIndexOfStr = insertText.indexOf(selectedText);
      const cursorEndIndex = editorEngine.getRange().end;

      if (selectedIndexOfStr === -1) return;

      const text = this.text.slice(0, cursorEndIndex);
      const insertTextIndex = text.length - insertText.length;
      const rangeStartIndex = insertTextIndex + selectedIndexOfStr;
      const rangeEndIndex = rangeStartIndex + selectedText.length;

      this.$refs.editorEngine.setRange({
        start: rangeStartIndex,
        end: rangeEndIndex,
      });
    },
  },
};

createEditor(component);

export default component;
</script>

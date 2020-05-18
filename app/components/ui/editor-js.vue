<template>
  <div
    id="editor"
    ref="editor"
    @keydown="passValue"
  />
</template>

<script>
export default {
    props: {
        savedData: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            editor: null,
            content: {},
        }
    },
    mounted() {
        this.editor = this.$configEditorIn(this)(this.$refs.editor, this.savedData)
    },
    methods: {
        async passValue() {
            const s = await this.editor.save()
            this.$emit(`input`, s)
        },
    },
}
</script>
<style>
.codex-editor__redactor {
    padding-bottom: 0px !important;
}
</style>

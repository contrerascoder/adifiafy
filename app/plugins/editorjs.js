import EditorJs from '@editorjs/editorjs'
import Header from '@editorjs/header'
import ImageTool from '@editorjs/image'
import Vue from 'vue'

Vue.prototype.$configEditorIn = (vm) => function configuringEditor(el, content = undefined) {
    return new EditorJs({
        holder: el,
        data: content,
        placeholder: `Comienza aquí a escribir`,
        tools: {
            header: {
                class: Header,
                inlineToolbar: true,
            },
            image: {
                class: ImageTool,
                config: {
                    uploader: {
                        async uploadByFile(file) {
                            const fd = new FormData()
                            fd.append(`image`, file)
                            const response = await vm.axiosRequest({
                                url: `/articles/image`,
                                method: `post`,
                                data: fd,
                            })
                            return response.data
                        },
                    },
                },
            },
            // ...
        },
    })
}

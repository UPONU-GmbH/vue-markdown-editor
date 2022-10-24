import { image } from '../utils/constants/command';
import { filesFilter } from '../utils/file';

export default {
  name: image,
  icon: 'v-md-icon-img',
  title: (editor) => editor.langConfig.image.toolbar,
  menus: [
    {
      name: 'image-link',
      text: (editor) => editor.langConfig.imageLink.toolbar,
      action(editor, config) {
        if (config?.insertWithSize) {
          editor.execCommand(image, { width: 'auto', height: 'auto' });
        } else {
          editor.execCommand(image);
        }
      },
    }
  ],
};

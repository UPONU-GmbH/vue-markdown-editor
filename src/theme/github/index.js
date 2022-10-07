import parser from './parser';

// style
import '../../assets/css/theme/base.css';
import '../../assets/css/theme/github-markdown.css';

const install = function (VMdEditor, options) {
  VMdEditor.vMdParser.use(parser, options);
};

export default {
  install,
};

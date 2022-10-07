const defaultHotkeys = import.meta.glob('../hotkeys/*.js', { eager: true })

export default function (Component) {
  return {
    mounted() {
      if (this.isPreviewMode) return;

      const { hotkeys } = Component;

      Object.keys(defaultHotkeys).forEach((key) => {
        this.registerHotkeys(defaultHotkeys[key].default);
      });

      hotkeys.forEach((config) => {
        this.registerHotkeys(config);
      });
    },
    methods: {
      registerHotkeys({ modifier, key, action, preventDefault = true }) {
        this.editorRegisterHotkeys({
          modifier,
          key,
          preventDefault,
          action: (...arg) => action(this, ...arg),
        });
      },
    },
  };
}

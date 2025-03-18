// global.d.ts

declare module 'cc' {
  interface Node {
    normalize: (this: Node) => void;
    setSpriteFrame: (this: Node, url) => void;
  }

  interface Sprite {
    setSpriteFrame: (this: Node, url) => void;
  }
}

import type { MyElementNode, MyTextNode } from "./types";

const setStyleAttrs = (
  node: HTMLElement | null,
  stylesMap: Record<string, string>
) => {
  if (!node) return;

  for (const key in stylesMap) {
    if (!stylesMap.hasOwnProperty(key)) continue;

    node.style[key as any] = stylesMap[key];
  }
};

const setAttrs = (node: any, key: string | number, val: any) => {
  if (key === "styles") {
    setStyleAttrs(node, val);
    return;
  }

  if (/^on/.test(key.toString())) {
    const type = key.toString().substr(2).toLocaleLowerCase();

    node.addEventListener(type, val);
  }

  node[key] = val;
};

const paint = (
  element: MyElementNode | MyTextNode | null,
  container: HTMLElement | null,
  isReplace: boolean
) => {
  if (!element || !container) return;

  if (typeof element === "string") {
    isReplace ? container.replaceChildren(element) : container.append(element);
    return;
  }

  const node = document.createElement(element.tagName);

  for (const key in element.props) {
    if (!element.props.hasOwnProperty(key)) continue;

    setAttrs(node, key, element.props[key]);
  }

  for (const child of element.children!) {
    paint(child as MyElementNode, node, false);
  }

  isReplace ? container.replaceChildren(node) : container.append(node);
};

export default paint;

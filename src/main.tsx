import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import './index.css'
import App from ".";

if (typeof Node === "function" && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  //@ts-expect-error implemented solution from https://github.com/facebook/react/issues/11538#issuecomment-417504600, no TS solution available
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) {
      if (console) {
        console.error(
          "Cannot remove a child from a different parent",
          child,
          this
        );
      }
      return child;
    }
    //@ts-expect-error implemented solution from https://github.com/facebook/react/issues/11538#issuecomment-417504600, no TS solution available
    // eslint-disable-next-line prefer-rest-params
    return originalRemoveChild.apply(this, arguments);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  //@ts-expect-error implemented solution from https://github.com/facebook/react/issues/11538#issuecomment-417504600, no TS solution available
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console) {
        console.error(
          "Cannot insert before a reference node from a different parent",
          referenceNode,
          this
        );
      }
      return newNode;
    }

    //@ts-expect-error implemented solution from https://github.com/facebook/react/issues/11538#issuecomment-417504600, no TS solution available
    // eslint-disable-next-line prefer-rest-params
    return originalInsertBefore.apply(this, arguments);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

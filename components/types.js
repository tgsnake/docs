export function TypeString({ text }) {
  return (
    <span className="underline  text-green-600 dark:text-green-300">{text ? text : 'string'}</span>
  );
}
export function TypeNumber({ text }) {
  return (
    <span className="underline  text-blue-600 dark:text-blue-300">{text ? text : 'number'}</span>
  );
}
export function TypeArray({ children }) {
  return (
    <span className="underline  text-yellow-600 dark:text-yellow-300">
      Array&lt;{children ? children : <TypeNever />}&gt;
    </span>
  );
}
export function TypeFunction({ text }) {
  return (
    <span className="underline  text-purple-600 dark:text-purple-300">
      {text ? text : 'Function'}
    </span>
  );
}
export function TypeObject({ text }) {
  return (
    <span className="underline  text-orange-600 dark:text-orange-300">
      {text ? text : 'Object'}
    </span>
  );
}
export function TypeBoolean({ text }) {
  return (
    <span className="underline  text-amber-600 dark:text-amber-300">{text ? text : 'boolean'}</span>
  );
}
export function TypeUndefined({ text }) {
  return (
    <span className="underline  text-lime-600 dark:text-lime-300">{text ? text : 'undefined'}</span>
  );
}
export function TypeNever({ text }) {
  return (
    <span className="underline  text-fuchsia-600 dark:text-fuchsia-300">
      {text ? text : 'never'}
    </span>
  );
}

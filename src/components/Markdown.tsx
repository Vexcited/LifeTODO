import { createEffect, type Component } from "solid-js";

import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, {allowDangerousHtml: true})
  .use(rehypeRaw)
  .use(rehypeStringify)


const Markdown: Component<{ raw: string }> = (props) => {
  let container: HTMLDivElement | undefined;

  createEffect(async () => {
    if (!container) return;

    const file = await processor.process(props.raw);
    container.innerHTML = String(file);
  });

  return <div ref={container} />;
};

export default Markdown;

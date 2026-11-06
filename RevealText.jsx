import { motion } from 'motion/react';

/**
 * Staggered word-by-word reveal: each word rises out of its own mask.
 * Re-animates when the text changes (e.g. on language switch).
 */
const container = (stagger, delay) => ({
  hidden: {},
  shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
});
const word = {
  hidden: { y: '110%', opacity: 0 },
  shown: { y: '0%', opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};

export default function RevealText({
  text,
  as = 'span',
  className,
  stagger = 0.06,
  delay = 0,
  trigger = 'inView',
  style,
}) {
  const Tag = motion[as];
  const words = String(text).split(' ');
  const triggerProps =
    trigger === 'mount'
      ? { initial: 'hidden', animate: 'shown' }
      : { initial: 'hidden', whileInView: 'shown', viewport: { once: true, margin: '-8% 0px' } };

  return (
    <Tag key={text} className={className} style={style} variants={container(stagger, delay)} {...triggerProps} aria-label={text}>
      {words.map((w, i) => (
        <span className="reveal-line" key={`${w}-${i}`} aria-hidden="true">
          <motion.span className="reveal-word" variants={word}>
            {w}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}

/** Simple fade-and-rise block reveal for paragraphs and groups. */
export function Reveal({ children, delay = 0, y = 24, className, as = 'div', style }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}

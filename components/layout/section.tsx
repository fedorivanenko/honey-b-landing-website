import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from "class-variance-authority";

const sectionVariants = cva(
  "flex flex-col",
  {
    variants: {
      animated: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      animated: true,
    },
  }
);

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  className?: string;
  as?: 'section' | 'div'
}

function Section({ className, animated, as = 'section', ...props }: SectionProps) {
    return React.createElement(
      as,
      { className: cn(sectionVariants({ animated }), className), ...props },
      props.children
    );
  }
  
  export { Section, sectionVariants };
  
import { createContext, useContext, useMemo, useEffect, type ReactNode } from 'react';

export type DesignVariant = 'current' | 'anthro' | 'v5';

interface MotionTokens {
  fast: number;
  normal: number;
  slow: number;
  emphasis: number;
}

interface DesignVariantContextValue {
  variant: DesignVariant;
  motion: MotionTokens;
}

const MOTION_TOKENS: Record<DesignVariant, MotionTokens> = {
  current:  { fast: 0.15, normal: 0.3,  slow: 0.5,  emphasis: 0.8  },
  anthro:   { fast: 0.1,  normal: 0.2,  slow: 0.35, emphasis: 0.6  },
  v5:       { fast: 0.2,  normal: 0.4,  slow: 0.7,  emphasis: 1.2  },
};

const VALID_VARIANTS: DesignVariant[] = ['current', 'anthro', 'v5'];

const DesignVariantContext = createContext<DesignVariantContextValue>({
  variant: 'current',
  motion: MOTION_TOKENS.current,
});

export function useDesignVariant() {
  return useContext(DesignVariantContext);
}

export function DesignVariantProvider({ children }: { children: ReactNode }) {
  const variant = useMemo<DesignVariant>(() => {
    const params = new URLSearchParams(window.location.search);
    const param = params.get('design') as DesignVariant;
    return VALID_VARIANTS.includes(param) ? param : 'current';
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-design', variant);
  }, [variant]);

  const value = useMemo<DesignVariantContextValue>(() => ({
    variant,
    motion: MOTION_TOKENS[variant],
  }), [variant]);

  return (
    <DesignVariantContext.Provider value={value}>
      {children}
    </DesignVariantContext.Provider>
  );
}

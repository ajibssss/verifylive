declare module 'swagger-ui-react' {
  import * as React from 'react';
  
  export interface SwaggerUIProps {
    spec?: Record<string, unknown> | object;
    url?: string;
    layout?: string;
    docExpansion?: 'list' | 'full' | 'none';
    onComplete?: (system: unknown) => void;
    requestInterceptor?: (req: unknown) => unknown | Promise<unknown>;
    responseInterceptor?: (res: unknown) => unknown | Promise<unknown>;
    displayOperationId?: boolean;
    showMutatedRequest?: boolean;
    supportedSubmitMethods?: string[];
    defaultModelsExpandDepth?: number;
    plugins?: unknown[];
    presets?: unknown[];
  }

  const SwaggerUI: React.ComponentType<SwaggerUIProps>;
  export default SwaggerUI;
}

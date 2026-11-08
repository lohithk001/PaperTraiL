declare const process: {
  env: Record<string, string | undefined>;
};

declare module 'inngest' {
  export class Inngest {
    constructor(config: { id: string });
    createFunction(
      config: { id: string },
      trigger: { event?: string; cron?: string },
      handler: (args: any) => Promise<any>
    ): any;
  }
}

declare module 'resend' {
  export class Resend {
    constructor(apiKey: string);
    emails: {
      send(data: any): Promise<any>;
    };
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Edm } from 'odata4-metadata';
import { XmlMetadata } from './xmlMetadata';
import { defineEntities } from './defineEntities';
import { Request, Response, RequestHandler } from 'express';

export class ServiceMetadata {
  static processMetadataJson(json, options?: object) {
    const edmx = new Edm.Edmx(json);
    return new this(edmx, options);
  }
  static processEdmx(edmx: Edm.Edmx, options?: object) {
    return new this(edmx, options);
  }
  static defineEntities(entityConfig: object, options?: object) {
    const json = defineEntities(entityConfig);
    const edmx = new Edm.Edmx(json);
    return new this(edmx, options);
  }

  edmx: Edm.Edmx;
  protected data: any;
  constructor(edmx: Edm.Edmx, options?: object) {
    this.edmx = edmx;
    this.process(edmx, options);
  }

  document(format?: string) {
    switch (format) {
      case 'json':
      case 'application/json':
        throw new Error('Not implemented');
      default:
        return this.data;
    }
  }

  process(edmx: Edm.Edmx, options?: object) {
    const xmlMetadata = new XmlMetadata(options, edmx);
    this.data = xmlMetadata.processMetadata();
  }

  requestHandler(format?: string) {
    return (_: Request, res: Response, __: RequestHandler) => {
      res.set('Content-Type', 'application/xml');
      res.send(this.document(format));
    };
  }

  valueOf() {
    return this.data;
  }
}

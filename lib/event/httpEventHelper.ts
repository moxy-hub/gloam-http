import {HttpClientOptions} from "../domain/httpClientOptions";
import {HttpEvent} from "./httpEvent";

export function obtainEvent(options: HttpClientOptions): HttpEvent {
  const event = options.event!;
  if (!event) {
    console.warn("HttpClient没有注册事件，可能会影响错误处理以及token感知");
  }
  return event;
}

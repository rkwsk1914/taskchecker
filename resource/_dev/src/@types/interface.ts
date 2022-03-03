export interface EventItem {
  id: string,
  title: string,
  start: string,
  end?: string,
  allDay?: boolean,
  url?: string,
  backgroundColor?: string,
  editable?: boolean,
  classNames?: string,
  holiday?: string,
  display?: string,
  businessHours?: object
}

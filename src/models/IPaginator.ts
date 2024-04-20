export interface IPaginator<T> {
  "current_page": number,
  "data": T[],
  "first_page_url": string,
  "from": number,
  "last_page": number,
  "last_page_url": string,
  "links": [
    {
      "url": null,
      "label": string,
      "active": boolean
    },
    {
      "url": string,
      "label": number,
      "active": boolean
    },
    {
      "url": null,
      "label": string,
      "active": boolean
    }
  ],
  "next_page_url": string,
  "path": string,
  "per_page": number,
  "prev_page_url": boolean,
  "to": number,
  "total": number
}

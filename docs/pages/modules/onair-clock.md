---
layout: page
title: On-Air Clock
parent: Modules
nav_order: 21
---

# On-Air Clock

HTML Based On Air clock for rendering with OBS or CasparCG

# Default Configuration

```
{
  "id": "",
  "order": 0,
  "needsConfigured": false,
  "title": "",
  "module": "onair-clock",
  "description": "A Clock that can be used in an HTML5 Graphics Renderer",
  "notes": "",
  "enabled": false,
  "header": "BUG Clock",
  "backgroundColor": "#000000",
  "textColor": "#ffffff",
  "showTime": true,
  "showDate": true,
  "timezone": {
    "value": "GMT Standard Time",
    "abbr": "GMT",
    "offset": 0,
    "isdst": false,
    "label": "(UTC) Edinburgh, London",
    "utc": [
      "Europe/Isle_of_Man",
      "Europe/Guernsey",
      "Europe/Jersey",
      "Europe/London"
    ]
  },
  "logo": {
    "name": "bug.png",
    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAGDf+RsAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF3mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuMTY0NjQ4LCAyMDIxLzAxLzEyLTE1OjUyOjI5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMiAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjEtMDMtMjRUMTg6MDI6MzhaIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wMy0yNFQxODowNDoyMloiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMDMtMjRUMTg6MDQ6MjJaIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjUwYTExNThlLWU4ZWMtNDk4NC1hMDUxLTVkOTMzMWViMjVhMCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjgxYTVlNjEyLWI2YTQtNDI0ZS1iMzljLTgwYjlkMmY2MDY2ZiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjlhZGQ5ZmNkLTMxM2MtNDFkZC05ZWJhLWFmNDNkZjQ0MTI1MyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OWFkZDlmY2QtMzEzYy00MWRkLTllYmEtYWY0M2RmNDQxMjUzIiBzdEV2dDp3aGVuPSIyMDIxLTAzLTI0VDE4OjAyOjM4WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjIgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjUwYTExNThlLWU4ZWMtNDk4NC1hMDUxLTVkOTMzMWViMjVhMCIgc3RFdnQ6d2hlbj0iMjAyMS0wMy0yNFQxODowNDoyMloiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4yIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpgzrtwAAF0vSURBVHic7d15fNTU2gfwJ5nuC2V3Q8u+C7SMogNFiyClUMQLoiC4gCAoCKKgUN/r1WsFxQ3lioIgCIIgXBCkFEFRSsetUKjsexXkiuyUli6T8/4xM6VsZaaT5CQ5v+/n411sJ3maOec5T06SE4kxRiKTeQfAGw4A7wB4wwHgHQBvOAC8A+AtiMdO7amrGJF0+Q+YQtmvJ1/hB9qR9CyE7KkZPu8sOy1JlwOhywFo/dTM6cHVbhpSiY86s9OS2qseUDmaH4C4UZ/Pt0XV6BfAJjQ9CJonwQD/eCIihyqBXIWmB8Cf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"
  }
}
```            

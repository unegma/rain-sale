/**
 * formatDateTime: https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
 * @param stamp
 */
export function formatDateTime(stamp: number) {
  try {
    const dtFormat = new Intl.DateTimeFormat('en-GB', {
      timeStyle: 'long',
      dateStyle: 'short',
      timeZone: 'UTC'
    });
    return dtFormat.format(new Date(stamp * 1e3));
  } catch(err) {
    console.log(err);
  }
}

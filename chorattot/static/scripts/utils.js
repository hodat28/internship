export function relativeTimeFromNow(isoString) {
  const DateTime = luxon.DateTime;
  const dateTime = DateTime.fromISO(isoString, { zone: "utc" });
  return dateTime.toRelative({ locale: "vi" });
}

export function formatMoney(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
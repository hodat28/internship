export function relativeTimeFromNow(isoString) {
  const DateTime = luxon.DateTime;
  const dateTime = DateTime.fromISO(isoString, { zone: "utc" });
  return dateTime.toRelative({ locale: "vi" });
}

export function formatMoney(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getCity(location) {
  const cityIndex = location.lastIndexOf("Thành phố");
  const provinceIndex = location.lastIndexOf("Tỉnh");
      
  if (cityIndex !== -1 ) {
      return location.substring(cityIndex + 10);
  }
  else if (provinceIndex !== -1) {
      return location.substring(provinceIndex + 5);
  }
  return location;
}
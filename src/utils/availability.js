const AVAILABILITY = {
  available: { label: "Available for work", tone: "open" },
  open_to_offers: { label: "Open to offers", tone: "open" },
  unavailable: { label: "Currently unavailable", tone: "busy" },
};

export function availabilityFor(status) {
  return AVAILABILITY[status] || AVAILABILITY.open_to_offers;
}

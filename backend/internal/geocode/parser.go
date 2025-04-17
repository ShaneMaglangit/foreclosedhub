package geocode

import (
	"regexp"
	"strings"
)

type ParsedAddress struct {
	AddressLine string
	Place       string
	Region      string
	Postcode    string
	Country     string
}

func parsePhilippineAddress(input string) ParsedAddress {
	parts := strings.Split(strings.ToUpper(strings.TrimSpace(input)), ",")

	for i, part := range parts {
		parts[i] = strings.TrimSpace(part)
	}

	count := len(parts)
	parsed := ParsedAddress{Country: "Philippines"}

	if count == 0 {
		return parsed
	}

	last := parts[count-1]
	postcode := extractPostcode(last)
	hasPostcode := postcode != ""

	if hasPostcode && count >= 4 {
		parsed.Postcode = postcode
		parsed.Region = parts[count-2]
		parsed.Place = parts[count-3]
		parsed.AddressLine = strings.Join(parts[:count-3], ", ")
	} else if !hasPostcode && count >= 3 {
		parsed.Postcode = ""
		parsed.Region = parts[count-1]
		parsed.Place = parts[count-2]
		parsed.AddressLine = strings.Join(parts[:count-2], ", ")
	} else if count == 2 {
		parsed.AddressLine = parts[0]
		parsed.Place = parts[1]
	} else {
		parsed.AddressLine = parts[0]
	}

	return parsed
}

func extractPostcode(text string) string {
	re := regexp.MustCompile(`\d{4,}`)
	return re.FindString(text)
}

package db

func ParseSources(items []string) ([]Source, error) {
	sources := make([]Source, 0, len(items))

	for _, item := range items {
		source, err := ParseSource(item)
		if err != nil {
			return nil, err
		}
		sources = append(sources, source)
	}

	return sources, nil
}

func ParseSource(item string) (Source, error) {
	var source Source
	err := source.Scan(item)
	return source, err
}

TESTS = test/suite/*.js

all: test

test:
	@./node_modules/mocha/bin/mocha \
		$(TESTS)

.PHONY: test

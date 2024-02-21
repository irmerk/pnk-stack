.PHONY: install-dev install-prod compile lint test dev start update clean

PROJECT = "PNK Stack"

install-dev:
	echo "Installing all dependencies for ${PROJECT}..."; \
	rm -rf node_modules \
	npm install

install-prod:
	echo "Installing only prod dependencies for ${PROJECT}..."; \
	rm -rf node_modules \
	npm ci --only=production

compile:
	echo "Compiling ${PROJECT}..."; \
	npx tsc

lint:
	echo "Linting ${PROJECT}..."; \
	npx tsc --noEmit \
	npx eslint src

test:
	echo "Testing ${PROJECT}..."; \
	npx jest

dev:
	echo "Locally starting ${PROJECT}..."; \
	npm run dev

start:
	echo "Starting ${PROJECT}..."; \
	npm run compile \
	node ./dist

update:
	echo "Updating ${PROJECT}..."; \
	npm update

clean:
	echo "Removing node_modules from ${PROJECT}..."; \
	rm -rf dist \
	rm -rf node_modules

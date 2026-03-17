PNPM ?= pnpm

.PHONY: install build typecheck dev start clean

install:
	$(PNPM) install

build:
	$(PNPM) run build

typecheck:
	$(PNPM) exec tsc -p tsconfig.json --noEmit

dev:
	$(PNPM) run dev

start:
	$(PNPM) run start

clean:
	rm -rf dist

dev:
	npx wrangler dev

test-client:
	node test-client.mjs
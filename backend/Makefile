BUILD = go build
TEST = go test
LINT = golint
PROTOC = protoc 

INCLUDE_DIR = /home/nawin/dev/golang/googleapis/
PROTOC_GEN_TS_PATH = /home/nawin/.nvm/versions/node/v22.8.0/bin/protoc-gen-ts
.DEFAULT_GOAL := build

.PHONY: test proto openapi
# Lint target
lint:
	$(LINT) ./...

# Build target, dependent on lint
build: lint
	$(BUILD)  -o ./bin/main main.go
	$(BUILD)  -o ./bin/reg_client client/registry_client_example.go
	$(BUILD)  -o ./bin/exe_client client/executor_client_example.go

# Testing
test:
	$(TEST) ./test/... -v

dirs:
	mkdir -p pkg/common pkg/registry pkg/executor

# Creates the protpbuf go files
proto: dirs
	$(PROTOC) \
	--go_out=./pkg/common --go_opt=paths=source_relative \
	--go-grpc_out=./pkg/common --go-grpc_opt=paths=source_relative  \
	proto/common.proto

	$(PROTOC) \
	--go_out=./pkg/executor --go_opt=paths=source_relative \
	--go-grpc_out=./pkg/executor --go-grpc_opt=paths=source_relative  \
	proto/executor_service.proto

	$(PROTOC) \
	-I . -I=$(INCLUDE_DIR) \
	--grpc-gateway_out=./pkg/registry \
    --grpc-gateway_opt paths=source_relative \
    --grpc-gateway_opt generate_unbound_methods=true \
	--go_out=./pkg/registry --go_opt=paths=source_relative \
	--go-grpc_out=./pkg/registry --go-grpc_opt=paths=source_relative  \
	proto/registry_service.proto

# Creates the openapi def for the frontend project
openapi:
	$(PROTOC) \
	-I . -I=$(INCLUDE_DIR) \
	--openapi_out ../frontend/src/api/openapi \
	proto/registry_service.proto proto/common.proto

# Clean target
clean:
	rm ./build/* -f
	rm pkg/* -rdf
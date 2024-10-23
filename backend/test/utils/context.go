package utils

import (
	"context"

	"google.golang.org/grpc/peer"
)

type FakeAddr struct {
	network string
	address string
}

// Network returns the network type
func (f *FakeAddr) Network() string {
	return f.network
}

// String returns the string representation of the address
func (f *FakeAddr) String() string {
	return f.address
}

func CreateTestContext() context.Context {

	p := &peer.Peer{
		Addr: &FakeAddr{
			address: "127.0.0.1:0",
		},
	}

	return peer.NewContext(context.Background(), p)
}

func CreateTestContextWithIp(ip string) context.Context {

	p := &peer.Peer{
		Addr: &FakeAddr{
			address: ip,
		},
	}

	return peer.NewContext(context.Background(), p)
}

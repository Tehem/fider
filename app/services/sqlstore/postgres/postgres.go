package postgres

import (
	"context"

	"github.com/getfider/fider/app"

	"github.com/getfider/fider/app/models"
	"github.com/getfider/fider/app/pkg/bus"
	"github.com/getfider/fider/app/pkg/dbx"
	"github.com/stripe/stripe-go/client"
)

var stripeClient *client.API

func init() {
	bus.Register(Service{})
}

type Service struct{}

func (s Service) Name() string {
	return "PostgreSQL"
}

func (s Service) Category() string {
	return "sqlstore"
}

func (s Service) Enabled() bool {
	return true
}

func (s Service) Init() {
	bus.AddHandler(storeEvent)
}

type SqlHandler func(trx *dbx.Trx, tenant *models.Tenant, user *models.User) error

func using(ctx context.Context, handler SqlHandler) error {
	trx := ctx.Value(app.TransactionCtxKey).(*dbx.Trx)
	tenant, _ := ctx.Value(app.TenantCtxKey).(*models.Tenant)
	user, _ := ctx.Value(app.UserCtxKey).(*models.User)
	return handler(trx, tenant, user)
}
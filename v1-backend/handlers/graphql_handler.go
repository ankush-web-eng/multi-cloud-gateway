package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/graphql-go/graphql"
)

var userType = graphql.NewObject(graphql.ObjectConfig{
	Name: "User",
	Fields: graphql.Fields{
		"data": &graphql.Field{
			Type: graphql.String,
		},
	},
})

var schema, _ = graphql.NewSchema(graphql.SchemaConfig{
	Query: graphql.NewObject(graphql.ObjectConfig{
		Name: "RootQuery",
		Fields: graphql.Fields{
			"user": &graphql.Field{
				Type: userType,
				Args: graphql.FieldConfigArgument{
					"id": &graphql.ArgumentConfig{Type: graphql.String},
				},
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					userID := p.Args["id"].(string)
					userData := getUser(userID)
					return map[string]interface{}{
						"data": userData,
					}, nil
				},
			},
		},
	}),
})

func GraphQLHandler(w http.ResponseWriter, r *http.Request) {
	result := graphql.Do(graphql.Params{
		Schema:        schema,
		RequestString: r.URL.Query().Get("query"),
	})
	json.NewEncoder(w).Encode(result)
}

bartender
=========

Bartender is a REST API for hyperlocal context.  The _nearby_ feature supports a single API query: /id/#.  Here, # is a unique identifier which can be an EUI-64 or an AdvA-48.  Bartender will return all tiraids in the database which have the given identifier as either:
- their own identifier
- the identifier of one of their radio decodings

NeDB is used as a database for simplicity and for future compatibility with MongoDB.

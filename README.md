## Document Processing System

Document Processing System

#### License

mit

## Local Installation Notes

### Install
```
bench new-site dubai-typing.local
bench --site dubai-typing.local install-app erpnext
bench --site dubai-typing.local install-app docproc
bench --site dubai-typing.local add-to-hosts
```

### Uninstall
```
bench --site dubai-typing.local uninstall-app docproc
bench drop-site dubai-typing.local --force
```  

#  Export fixtures
```
bench --site dubai-typing.local export-fixtures
```
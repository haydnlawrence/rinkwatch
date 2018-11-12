from arcgis.gis import GIS

import cgi
form = cgi.FieldStorage()

print(form["username"])

##gis = GIS("http://wlugeography.maps.arcgis.com", "colinr23", "pickle23")
##print(gis)
##
##group = gis.groups.search('title: RinkWatch, owner: colinr23', '')
##print(group)
##
##user = gis.users.create(username = 'thespatiallab@gmail.com',
##                              password = 'zdar34P&',
##                              firstname = 'test',
##                              lastname = 'test',
##                              email = 'thespatiallab@gmail.com',
##                              description = 'description',
##                              role = 'org_user',
##                              level = 2,
##                              provider = 'arcgis')
##
##group[0].add_users(user)
##print("User", user.username, " added to group", group[0].title)

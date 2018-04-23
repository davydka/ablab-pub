#!/bin/bash

FLAG="/home/deploy/firstboot.log"
if [ ! -f $FLAG ]; then
   #Put here your initialization sentences
   echo "This is the first boot"

   ansible-playbook -i /home/deploy/display_provisioning/inventory/hosts.displays /home/deploy/display_provisioning/displays.yml -c local --tags="setup" -v
   ansible-playbook -i /home/deploy/display_provisioning/inventory/hosts.displays /home/deploy/display_provisioning/displays.yml -c local --tags="deploy" -v

   #the next line creates an empty file so it won't run the next boot
   if [ $? -eq 0 ]
   then
     touch $FLAG
   fi
else
   echo "starting app"
   cd /home/deploy/of/apps/Sites/abilitylab-signage-hardware/src
   npm run start
fi

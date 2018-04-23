# Abilitylab Signage Hardware

### static ip on xubuntu 17.10
````
sudo vim /etc/netplan/01-network-manager-all.yaml

# Let NetworkManager manage all devices on this system
network:
  version: 2
  renderer: NetworkManager
  ethernets:
    enp0s25:
      dhcp4: no
      dhcp6: no
      addresses: [192.168.3.15/24]
      gateway4: 192.168.3.1
      nameservers:
        addresses: [8.8.8.8,8.8.4.4]


sudo netplan apply
````

### image processing notes
````
imagemagick - create gradient
convert -size 600x416 gradient:'#ef6823'-'#ea232d' linear_gradient.jpg
````
````
gmic - apply a screen blend mode
gmic dawg.jpg linear_gradient.jpg blend screen -output test.jpg
````
````
pipe imagemagick to gmic, less file writes
convert -size 600x416 gradient:'#ef6823'-'#ea232d' jpg:- | gmic dawg.jpg jpg:- blend screen -output test.jpg
````
### ansible notes
```
ansible-playbook -i /home/deploy/display_provisioning/inventory/hosts.displays /home/deploy/display_provisioning/displays.yml -c local -v
ansible-playbook -i /home/deploy/display_provisioning/inventory/hosts.displays /home/deploy/display_provisioning/displays.yml --tags="restart_web" -v
```

### linux remaster notes
````
SETUP
sudo apt-get install squashfs-tools genisoimage resolvconf
mkdir ~/livecdtmp
cd ~/livecdtmp
mkdir extract-cd mnt
sudo mount -o loop ~/INSERT-NAME-HERE.iso mnt
sudo rsync --exclude=/casper/filesystem.squashfs -a mnt/ extract-cd
sudo unsquashfs mnt/casper/filesystem.squashfs
sudo mv squashfs-root edit
sudo cp /etc/resolv.conf edit/etc/
sudo mount --bind /dev/ edit/dev
sudo chroot edit
mount -t proc none /proc && mount -t sysfs none /sys && mount -t devpts none /dev/pts
export HOME=/root && export LC_ALL=C
cd /etc/skel
mkdir Desktop Documents Downloads Music Pictures Public Templates Videos
cd /


MAKE CHANGES (apt-get install, folder structure in /etc/skel, etc)


EXIT CHROOT
apt-get clean
apt-get autoremove
rm -rf /tmp/* ~/.bash_history
umount /proc
umount /sys
umount /dev/pts
exit
sudo umount edit/dev
sudo umount mnt


BUILD ISO
sudo rm ~/livecdtmp/extract-cd/casper/filesystem.squashfs
cd livecdtmp
sudo mksquashfs edit extract-cd/casper/filesystem.squashfs
sudo nano extract-cd/README.diskdefines
cd extract-cd
sudo rm md5sum.txt
find -type f -print0 | sudo xargs -0 md5sum | grep -v isolinux/boot.cat | sudo tee md5sum.txt
cd ..
sudo mkisofs -r -V "REMASTER" -cache-inodes -J -l -b isolinux/isolinux.bin -c isolinux/boot.cat -no-emul-boot -boot-load-size 4 -boot-info-table -o ../REMASTER.iso extract-cd
cd ..
sudo chmod 777 REMASTER.iso
isohybrid REMASTER.iso


LOOK and FEEL CUSTOMIZATION
installation slideshow files
livecdtmp/edit/usr/share/ubiquity-slideshow

preseed file
livecdtmp/extract-cd/install.seed

config to use preseed and do automatic install
livecdtmp/extract-cd/isolinux/txt.cfg
	important parts
		automatic-ubiquity
		preseed/file=/cdrom/install.seed

default background
livecdtmp/edit/usr/share/xfce4/backdrops
xubuntu-zesty.png

boot and shut down splash screen
livecdtmp/edit/usr/share/plymouth/themes/xubuntu-logo
wallpaper.png

run programs once desktop environment starts
livecdtmp/edit/etc/xdg/autostart

modify new user / default user folder structure
livecdtmp/etc/skel
	notable additions:
	openframeworks ~/og
	ansible scripts ~/display_provisioning
````

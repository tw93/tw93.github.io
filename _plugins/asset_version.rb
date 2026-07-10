# Computes a content-based fingerprint for first-party CSS/JS so the ?v=
# cache-busting query only changes when an asset actually changes. The old
# site.time scheme regenerated every build (including the daily AI-data sync
# push), forcing all visitors to re-download unchanged CSS/JS.
require 'digest'

Jekyll::Hooks.register :site, :after_reset do |site|
  files = Dir[File.join(site.source, '{css,js,_sass}', '**', '*.{css,scss,js}')].sort
  digest = Digest::MD5.new
  files.each { |f| digest.update(File.read(f)) }
  site.config['asset_version'] = digest.hexdigest[0, 10]
end

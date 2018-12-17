task default: %[build]

desc "Build project"
task :build do
  puts "Building GraphQL server and React web containers ->"
  sh "docker-compose build"
end

desc "Lint project"
task :lint do
    puts "Linting project ->"
    sh "docker-compose run api npm run lint"
    sh "docker-compose run web npm run compile"
end

desc "Start GraphQL server"
task :server do
  puts "Starting GraphQL server ->"
  sh "docker-compose up api redis-server"
end

desc "Start React/Leaflet web client"
task :web do
  puts "Launching React/Leaflet web client ->"
  sh "docker-compose up web"
end

desc "Start GraphQL server & web client"
task :start do
  puts "Starting GraphQL server & web client ->"
  sh "docker-compose up"
end

desc "Flush Redis cache"
task :flush do
    puts "Flushing Redis cache ->"
    sh "docker-compose exec redis-server redis-cli flushall"
end
